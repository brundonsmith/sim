import { Update } from '../entity-component/entity';


import { aspects as transform_aspects } from './transform/transform';
import { aspects as transformDiscrete_aspects } from './transform-discrete/transform-discrete';

const aspects: {[key: string]: Object} = {
    ['transform']: transform_aspects,
    ['transform-discrete']: transformDiscrete_aspects,
}


import { update as transform_update } from './transform/transform';
import { update as transformDiscrete_update } from './transform-discrete/transform-discrete';

const updates: {[key: string]: Update<any>} = {
    ['transform']: transform_update,
    ['transform-discrete']: transformDiscrete_update,
}

export { updates };