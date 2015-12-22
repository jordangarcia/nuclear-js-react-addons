export default function() {
  let testRoot
  beforeEach(() => {
    testRoot = document.createElement('div')
    testRoot.id = 'test-root'
    document.body.appendChild(testRoot)
  })

  afterEach(() => {
    testRoot.remove()
  })
}
