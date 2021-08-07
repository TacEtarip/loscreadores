import { sumaTest } from '../index';
import supertest from 'supertest';

test('Suma Correctamente', () => {
    const valor = sumaTest(1, 2);
    expect(valor).toBe(3);
})