import { HookOptions, ReturnedValue } from 'use-sound/dist/types';
export default function useSound<T = any>(src: string | string[], { id, volume, playbackRate, soundEnabled, interrupt, onload, ...delegated }?: HookOptions<T>): ReturnedValue;
export { useSound };
