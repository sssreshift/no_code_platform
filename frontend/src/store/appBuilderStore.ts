import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { AppBuilderState, App, ComponentInstance, LayoutItem } from '@/types'

export const useAppBuilderStore = create<AppBuilderState>()(
  devtools(
    (set, get) => ({
      currentApp: null,
      selectedComponent: null,
      components: [],
      layout: [],

      setCurrentApp: (app: App | null) => {
        set({
          currentApp: app,
          components: [],
          layout: [],
          selectedComponent: null,
        })
      },

      setSelectedComponent: (component: ComponentInstance | null) => {
        set({ selectedComponent: component })
      },

      addComponent: (component: ComponentInstance) => {
        const { components, layout } = get()
        
        // Add component to components array
        const newComponents = [...components, component]
        
        // Add layout item
        const newLayoutItem: LayoutItem = {
          i: component.id,
          x: component.x,
          y: component.y,
          w: component.w,
          h: component.h,
        }
        const newLayout = [...layout, newLayoutItem]
        
        set({
          components: newComponents,
          layout: newLayout,
          selectedComponent: component,
        })
      },

      updateComponent: (id: string, updates: Partial<ComponentInstance>) => {
        const { components, layout } = get()
        
        // Update component
        const updatedComponents = components.map((comp) =>
          comp.id === id ? { ...comp, ...updates } : comp
        )
        
        // Update layout if position/size changed
        let updatedLayout = layout
        if (updates.x !== undefined || updates.y !== undefined || 
            updates.w !== undefined || updates.h !== undefined) {
          updatedLayout = layout.map((item) =>
            item.i === id
              ? {
                  ...item,
                  ...(updates.x !== undefined && { x: updates.x }),
                  ...(updates.y !== undefined && { y: updates.y }),
                  ...(updates.w !== undefined && { w: updates.w }),
                  ...(updates.h !== undefined && { h: updates.h }),
                }
              : item
          )
        }
        
        set({
          components: updatedComponents,
          layout: updatedLayout,
        })
        
        // Update selected component if it's the one being updated
        const { selectedComponent } = get()
        if (selectedComponent && selectedComponent.id === id) {
          set({ selectedComponent: { ...selectedComponent, ...updates } })
        }
      },

      removeComponent: (id: string) => {
        const { components, layout } = get()
        
        const filteredComponents = components.filter((comp) => comp.id !== id)
        const filteredLayout = layout.filter((item) => item.i !== id)
        
        set({
          components: filteredComponents,
          layout: filteredLayout,
          selectedComponent: null,
        })
      },

      updateLayout: (newLayout: LayoutItem[]) => {
        const { components } = get()
        
        // Update component positions based on layout
        const updatedComponents = components.map((component) => {
          const layoutItem = newLayout.find((item) => item.i === component.id)
          if (layoutItem) {
            return {
              ...component,
              x: layoutItem.x,
              y: layoutItem.y,
              w: layoutItem.w,
              h: layoutItem.h,
            }
          }
          return component
        })
        
        set({
          layout: newLayout,
          components: updatedComponents,
        })
      },
    }),
    {
      name: 'app-builder',
    }
  )
)
