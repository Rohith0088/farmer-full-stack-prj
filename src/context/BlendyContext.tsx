import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';

interface BlendyInstance {
  toggle: (id: string, onDone?: () => void) => void;
  untoggle: (id: string, onDone?: () => void) => void;
  update: () => void;
}

interface BlendyContextType {
  toggle: (id: string, onDone?: () => void) => void;
  untoggle: (id: string, onDone?: () => void) => void;
  update: () => void;
}

const BlendyContext = createContext<BlendyContextType | null>(null);

interface BlendyProviderProps {
  children: ReactNode;
}

export const BlendyProvider: React.FC<BlendyProviderProps> = ({ children }) => {
  const blendyRef = useRef<BlendyInstance | null>(null);

  useEffect(() => {
    // Dynamic import to avoid type issues with blendy
    import('blendy').then((mod: any) => {
      const create = mod.createBlendy || mod.default?.createBlendy;
      if (create) {
        blendyRef.current = create({
          animation: 'dynamic',
        });
      }
    }).catch(() => {
      console.warn('Blendy library not available');
    });
  }, []);

  const toggle = (id: string, onDone?: () => void): void => {
    if (blendyRef.current) {
      blendyRef.current.toggle(id, onDone);
    }
  };

  const untoggle = (id: string, onDone?: () => void): void => {
    if (blendyRef.current) {
      blendyRef.current.untoggle(id, onDone);
    }
  };

  const update = (): void => {
    if (blendyRef.current) {
      blendyRef.current.update();
    }
  };

  return (
    <BlendyContext.Provider value={{ toggle, untoggle, update }}>
      {children}
    </BlendyContext.Provider>
  );
};

export const useBlendy = (): BlendyContextType => {
  const context = useContext(BlendyContext);
  if (!context) {
    throw new Error('useBlendy must be used within a BlendyProvider');
  }
  return context;
};
