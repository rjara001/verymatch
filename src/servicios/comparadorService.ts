export class porcentajeCentral {
    _id: string;
    _valor: string;

    constructor(id, valor) {
        this._valor = valor;
        this._id = id;
    }
    reducirValor(largoValor) {
        if (largoValor % 2 == 0)
            this._valor = this._valor.substring(0, largoValor - 1);
        else
            this._valor = this._valor.substring(1, largoValor);
    }
    Calcular() {
        var _largoId = this._id.length;
        var _largoValor = 0;

        do {

            _largoValor = this._valor.length;

            if (this._id.indexOf(this._valor) >= 0)
                return Math.round(_largoValor / _largoId * 100);
            else
                this.reducirValor(_largoValor);
        } while (_largoValor > 0);

        return 0;
    }
}

export class porcentajeDer extends porcentajeCentral{
    constructor(id, valor) {
        super(id,valor);
        porcentajeCentral.call(this, id, valor);
    }

    reducirValor(largoValor) {
        this._valor = this._valor.substring(0, largoValor - 1);
    }
}

export class porcentajeIzq extends porcentajeCentral{
    constructor(id, valor) {
        super(id,valor);
        porcentajeCentral.call(this, id, valor);
    }

    reducirValor(largoValor) {
        this._valor = this._valor.substring(1, largoValor);    
    }
}


