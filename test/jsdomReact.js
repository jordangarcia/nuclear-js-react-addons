import ExecutionEnvironment from 'react/lib/ExecutionEnvironment'
import jsdom from 'mocha-jsdom'

export default function jsdomReact() {
  if (typeof process === 'object') {
    jsdom()
    ExecutionEnvironment.canUseDOM = true
  }
}
