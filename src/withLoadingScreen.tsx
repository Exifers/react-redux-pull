import React, {Component} from "react";
import {fetchAjaxStoreData} from "./actions";
import {connect} from "react-redux";

const LoadingScreen = () => <div>Loading ...</div>;

// TODO possible list of requests based on previous requests

const eval_ = (o:any, args:any) => o instanceof Function ? o(args) : o

const evalResources = (props:any, resources:any, prefix:string, lambda:any) => (
  resources[lambda]((resource:any) => {
    const c_propName = eval_(resource.propName, props)
    const propVal = props[prefix + c_propName]
    return propVal !== undefined && propVal !== null
  })
)

const everyResponse = (props:any, resources:any) => (
  evalResources(props, resources, 'response_', 'every')
)

const someError = (props:any, resources:any) => (
  evalResources(props, resources, 'error_', 'some')
)

const someLoading = (props:any, resources:any) => (
  evalResources(props, resources, 'loading_', 'some')
)

const responses = (props:any, resources:any) => (
  resources.reduce((acc:any, resource:any) => {
    const c_propName = eval_(resource.propName, props)
    acc[c_propName] = props[`response_${c_propName}`]
    return acc
  }, {})
)


const withLoadingScreenBase = (resources:any, config:any) => (WrappedComponent:any) => {

  const mapStateToProps = (state:any, props:any) => {
    return resources.reduce((acc:any, resource:any) => {
      const c_propName = eval_(resource.propName, props)
      acc[`loading_${c_propName}`] = state.ajax[c_propName] && state.ajax[c_propName].loading
      acc[`error_${c_propName}`] = state.ajax[c_propName] && state.ajax[c_propName].error
      acc[`response_${c_propName}`] = state.ajax[c_propName] && state.ajax[c_propName].response
      return acc
    }, {})
  }

  const mapDispatchToProps = (dispatch:any) => ({
    fetch: (propName_:string, url_:string) => dispatch(fetchAjaxStoreData(propName_, url_))
  })

  return (
    connect(mapStateToProps, mapDispatchToProps)(
      class extends Component {
        constructor(props:any) {
          super(props)

          this.fetchResources = this.fetchResources.bind(this);

          this.fetchResources();
        }

        componentDidUpdate() {
          this.fetchResources()
        }

        fetchResources() {
          resources.forEach((resource:any) => {
            const c_propName = eval_(resource.propName, this.props)
            const c_url = eval_(resource.url, this.props)           
            // @ts-ignore
            if (!this.props[`response_${c_propName}`]
            // @ts-ignore
              && !this.props[`loading_${c_propName}`]
            // @ts-ignore
              && !this.props[`error_${c_propName}`]) {
              this.props.fetch(c_propName, c_url)
            }
          })
        }

        render() {
          if (everyResponse(this.props, resources)) {
            return <WrappedComponent {...responses(this.props, resources)} {...this.props}/>
          }

          if (someError(this.props, resources)) {
            return (
              <div>An error has occurred.</div>
            )
          }

          if (someLoading(this.props, resources)) {
            return config.loadingScreen || (
              <LoadingScreen/>
            )
          }

          return null
        }
      }
    )
  )
}

/**
 * A wrapper acting as the first layer of withLoadingScreen HOC to provide props in case of functional id and/or url.
 * @param resources
 * @param config
 * @returns {function(*=)}
 */
export default (resources:any, config:any = {}) => (WrappedComponent:any) => {

  const mapStateToProps = (state:any) => {
    return {
      ...(config.mapStateToProps && config.mapStateToProps(state))
    }
  }

  const DecoratedWrappedComponent = withLoadingScreenBase(resources, config)(WrappedComponent)

  return (
    connect(mapStateToProps)(
      class extends Component {
        render() {
          return (
            <DecoratedWrappedComponent {...this.props}/>
          )
        }
      }
    )
  )
}
