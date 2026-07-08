import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripHorizontal } from 'lucide-react';

export default function SortableWidgetWrapper({ id, children, isAdmin }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} className={`group relative ${isDragging ? 'opacity-60 scale-105 z-50 drop-shadow-2xl' : ''}`}>
      {isAdmin && (
        <div 
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-600 rounded-full px-3 py-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-white hover:bg-orange-500 hover:border-orange-400 z-50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-lg"
          {...attributes}
          {...listeners}
          title="Arrastar para reordenar"
        >
          <GripHorizontal size={16} />
        </div>
      )}
      {children}
    </div>
  );
}
