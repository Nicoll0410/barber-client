// mockUseFrameSize.js
export const useFrameSize = () => ({ 
  width: typeof window !== 'undefined' ? window.innerWidth : 1024, 
  height: typeof window !== 'undefined' ? window.innerHeight : 768 
});

export default useFrameSize;