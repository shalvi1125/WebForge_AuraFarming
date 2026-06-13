// src/react-app/components/ArtifactPanel.tsx
// Generic detail panel / modal — reusable across HostelIQ portals
// (e.g. complaint detail, room detail, visitor info)

import { X, Info, ZoomIn, RotateCw } from 'lucide-react';

export interface PanelItem {
  name: string;
  description?: string | null;
  scale_factor?: number;
  is_interactive?: boolean;
}

interface DetailPanelProps {
  item: PanelItem | null;
  onClose: () => void;
  title?: string;
}

export default function DetailPanel({ item, onClose, title = 'Details' }: DetailPanelProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold mb-2 pr-12">{item.name}</h2>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Info className="w-4 h-4" />
              <span>{title}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview placeholder */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 flex items-center justify-center min-h-[200px] border-2 border-dashed border-blue-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCw className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Preview</h3>
                <p className="text-blue-700 text-sm">Visual preview will appear here</p>
              </div>
            </div>

            {/* Item information */}
            <div className="space-y-4">
              {item.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <div>
                    {item.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-700 leading-relaxed mb-3 text-sm">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {(item.scale_factor !== undefined || item.is_interactive !== undefined) && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  {item.scale_factor !== undefined && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-1">Scale</h4>
                      <p className="text-gray-900">{item.scale_factor}x</p>
                    </div>
                  )}
                  {item.is_interactive !== undefined && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-1">Interactive</h4>
                      <p className="text-gray-900">{item.is_interactive ? 'Yes' : 'No'}</p>
                    </div>
                  )}
                </div>
              )}

              {item.is_interactive && (
                <div className="bg-blue-50 rounded-lg p-4 mt-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Tips</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Click to interact with this item</li>
                    <li>• Use the controls to navigate</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
