import { sumaTest } from '../src/index';

test('Suma Correctamente', () => {
    const valor = sumaTest(1, 2);
    expect(valor).toBe(3);
})