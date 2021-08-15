import { Color } from '../src/server/lib/interfaces';
import { comprobarColor } from '../src/server/controllers/helpers-control';

describe('Comprobar Valor Colores', () => {
    const color = { R: 250, G: 250, B: 250, nombre: 'Cualquiera', hex_code: '000000'} as Color;
    it('Comprobar R', () => {
        const comprobacion = comprobarColor(color);
        expect(comprobacion).toBe(true);
    })
});