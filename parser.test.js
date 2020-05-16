const parse = require('./parser');

test('split quotes', () => {
    const text = `Los cuatro pilares de la inversión (Spanish Edition) (Bernstein, William)
    - La subrayado en la posición 6279-6281 | Añadido el domingo, 22 de marzo de 2020 23:59:18
    
    Finalmente, dado que nuestras estimaciones en torno a la rentabilidad futura de acciones y bonos son muy rigurosas, no tiene mucho sentido poseer más del 80% de acciones, más allá de lo agresivo y tolerante al riesgo que usted sea.
    ==========
    Soft Skills: The software developer's life manual (John Sonmez)
    - La subrayado en la posición 1350-1350 | Añadido el viernes, 3 de abril de 2020 22:35:49
    
    Keep a daily log of your activities— Send
    ==========`

    expect(parse(text).length).toBe(2);
    
  });