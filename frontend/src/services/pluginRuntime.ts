import React from 'react'
import { PluginPublic, PluginComponent, PluginAssets } from '@/types/plugin'

class PluginRuntime {
  private loadedPlugins: Map<string, PluginComponent> = new Map()
  private loadedAssets: Set<string> = new Set()

  /**
   * Load a plugin and its assets
   */
  async loadPlugin(pluginData: PluginPublic): Promise<PluginComponent> {
    const pluginId = pluginData.id.toString()
    
    // Check if already loaded
    if (this.loadedPlugins.has(pluginId)) {
      return this.loadedPlugins.get(pluginId)!
    }

    try {
      // Load plugin assets first
      if (pluginData.assets) {
        await this.loadPluginAssets(pluginData.assets)
      }

      // Create plugin component
      const pluginComponent: PluginComponent = {
        id: pluginId,
        name: pluginData.name,
        type: pluginData.plugin_type,
        props: pluginData.default_config || {},
        styles: {},
        events: {},
        render: this.createPluginRenderer(pluginData)
      }

      // Cache the plugin
      this.loadedPlugins.set(pluginId, pluginComponent)
      
      return pluginComponent
    } catch (error) {
      console.error(`Failed to load plugin ${pluginId}:`, error)
      throw error
    }
  }

  /**
   * Load plugin assets (CSS, JS, etc.)
   */
  private async loadPluginAssets(assets: PluginAssets): Promise<void> {
    const loadPromises: Promise<void>[] = []

    // Load CSS files
    if (assets.css) {
      assets.css.forEach(cssUrl => {
        if (!this.loadedAssets.has(cssUrl)) {
          loadPromises.push(this.loadCSS(cssUrl))
        }
      })
    }

    // Load JS files
    if (assets.js) {
      assets.js.forEach(jsUrl => {
        if (!this.loadedAssets.has(jsUrl)) {
          loadPromises.push(this.loadJS(jsUrl))
        }
      })
    }

    await Promise.all(loadPromises)
  }

  /**
   * Load CSS file
   */
  private async loadCSS(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = url
      link.onload = () => {
        this.loadedAssets.add(url)
        resolve()
      }
      link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`))
      document.head.appendChild(link)
    })
  }

  /**
   * Load JS file
   */
  private async loadJS(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = url
      script.onload = () => {
        this.loadedAssets.add(url)
        resolve()
      }
      script.onerror = () => reject(new Error(`Failed to load JS: ${url}`))
      document.head.appendChild(script)
    })
  }

  /**
   * Create a renderer function for the plugin
   */
  private createPluginRenderer(pluginData: PluginPublic) {
    return (props: any) => {
      // This would be replaced with actual plugin rendering logic
      // For now, we'll create a basic renderer based on plugin type
      return this.renderPluginByType(pluginData, props)
    }
  }

  /**
   * Render plugin based on its type
   */
  private renderPluginByType(pluginData: PluginPublic, props: any): React.ReactElement {
    const { plugin_type } = pluginData
    const mergedProps = { ...pluginData.default_config, ...props }

    switch (plugin_type) {
      case 'component':
        return this.renderComponentPlugin(pluginData, mergedProps)
      case 'integration':
        return this.renderIntegrationPlugin(pluginData, mergedProps)
      case 'template':
        return this.renderTemplatePlugin(pluginData, mergedProps)
      case 'theme':
        return this.renderThemePlugin(pluginData, mergedProps)
      default:
        return this.renderUnknownPlugin(pluginData, mergedProps)
    }
  }

  /**
   * Render component plugin
   */
  private renderComponentPlugin(pluginData: PluginPublic, props: any): React.ReactElement {
    // This would execute the plugin's main file or render based on component type
    const { name } = pluginData
    
    // For now, return a placeholder component
    return React.createElement('div', {
      style: {
        padding: '16px',
        border: '2px dashed #ccc',
        borderRadius: '8px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9'
      }
    }, [
      React.createElement('h3', { key: 'title' }, name),
      React.createElement('p', { key: 'desc' }, 'Plugin Component'),
      React.createElement('pre', { key: 'props' }, JSON.stringify(props, null, 2))
    ])
  }

  /**
   * Render integration plugin
   */
  private renderIntegrationPlugin(_pluginData: PluginPublic, _props: any): React.ReactElement {
    // Integration plugins typically don't render UI but provide functionality
    return React.createElement('div', {
      style: { display: 'none' }
    }, 'Integration Plugin Loaded')
  }

  /**
   * Render template plugin
   */
  private renderTemplatePlugin(pluginData: PluginPublic, _props: any): React.ReactElement {
    // Template plugins provide pre-built layouts
    return React.createElement('div', {
      style: {
        padding: '16px',
        border: '2px solid #4caf50',
        borderRadius: '8px',
        backgroundColor: '#e8f5e8'
      }
    }, [
      React.createElement('h3', { key: 'title' }, pluginData.name),
      React.createElement('p', { key: 'desc' }, 'Template Plugin'),
      React.createElement('div', { key: 'content' }, 'Template content would be rendered here')
    ])
  }

  /**
   * Render theme plugin
   */
  private renderThemePlugin(pluginData: PluginPublic, _props: any): React.ReactElement {
    // Theme plugins apply styling
    return React.createElement('div', {
      style: {
        padding: '16px',
        border: '2px solid #ff9800',
        borderRadius: '8px',
        backgroundColor: '#fff3e0'
      }
    }, [
      React.createElement('h3', { key: 'title' }, pluginData.name),
      React.createElement('p', { key: 'desc' }, 'Theme Plugin Applied')
    ])
  }

  /**
   * Render unknown plugin type
   */
  private renderUnknownPlugin(pluginData: PluginPublic, _props: any): React.ReactElement {
    return React.createElement('div', {
      style: {
        padding: '16px',
        border: '2px solid #f44336',
        borderRadius: '8px',
        backgroundColor: '#ffebee'
      }
    }, [
      React.createElement('h3', { key: 'title' }, pluginData.name),
      React.createElement('p', { key: 'desc' }, 'Unknown Plugin Type'),
      React.createElement('p', { key: 'type' }, `Type: ${pluginData.plugin_type}`)
    ])
  }

  /**
   * Get loaded plugin by ID
   */
  getPlugin(pluginId: string): PluginComponent | undefined {
    return this.loadedPlugins.get(pluginId)
  }

  /**
   * Check if plugin is loaded
   */
  isPluginLoaded(pluginId: string): boolean {
    return this.loadedPlugins.has(pluginId)
  }

  /**
   * Unload a plugin
   */
  unloadPlugin(pluginId: string): void {
    this.loadedPlugins.delete(pluginId)
    // Note: In a real implementation, you'd also clean up loaded assets
  }

  /**
   * Get all loaded plugins
   */
  getLoadedPlugins(): PluginComponent[] {
    return Array.from(this.loadedPlugins.values())
  }

  /**
   * Clear all loaded plugins
   */
  clearAll(): void {
    this.loadedPlugins.clear()
    this.loadedAssets.clear()
  }
}

// Export singleton instance
export const pluginRuntime = new PluginRuntime()

// Export the class for testing
export { PluginRuntime }
