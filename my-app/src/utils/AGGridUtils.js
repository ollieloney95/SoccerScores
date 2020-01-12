export function onGridSizeChanged(params) {
    console.log('params', params)
    // fill out any available space to ensure there are no gaps
    params.api.sizeColumnsToFit();
}
