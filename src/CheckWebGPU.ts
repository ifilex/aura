export async function isWebGPUok(): Promise<true | string> {
    // En modo Lite, siempre retornamos true porque no necesitamos WebGPU
    console.log('Aura Lite: WebGPU no requerido para el modo de acompañamiento.');
    return true;
}
