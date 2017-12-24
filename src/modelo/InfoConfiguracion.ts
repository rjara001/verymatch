export class InfoConfiguracion {
    Id: number;
    CodigoUsuario: number;
    Opciones: string;

    constructor(codigoUsuario?: number) {
        if (codigoUsuario > 0)
            this.CodigoUsuario = codigoUsuario;

        this.Opciones = "0000000000";
    }

    poblar(config: InfoConfiguracion) {
        this.Id = config.Id;
        this.CodigoUsuario = config.CodigoUsuario;
        this.Opciones = config.Opciones;
    }
}