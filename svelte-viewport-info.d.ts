/**** determineScreenOrientation ****/
declare type Orientation = 'portrait' | 'landscape';
declare type detailledOrientation = 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary';
declare const _default: {
    readonly Width: number;
    readonly Height: number;
    readonly Orientation: Orientation | undefined;
    readonly detailledOrientation: detailledOrientation | undefined;
};
export default _default;
