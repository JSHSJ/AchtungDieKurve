import type { TPosition } from './TPosition';

export enum TDrawPathTypes {
    Tunnel = 0,
    Line = 1,
}

export type TDrawPath = TPosition & {
    type: TDrawPathTypes;
};
