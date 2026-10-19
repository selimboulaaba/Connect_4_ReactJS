import { Component } from 'react'
import { Button, EmptyState, Page } from '@/ui'

/** Shows a recovery screen instead of a blank page if something throws while rendering. */
export class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('UI error:', error, info.componentStack)
  }

  componentDidUpdate(prev) {
    // Navigating away clears the error.
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null })
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <Page size="sm">
        <EmptyState title="This page stopped working" action={<Button onClick={() => window.location.reload()}>Reload the page</Button>}>
          Reloading usually fixes it. Your games and progress are saved on the server.
        </EmptyState>
      </Page>
    )
  }
}
