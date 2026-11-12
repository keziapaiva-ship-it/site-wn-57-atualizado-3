class CorridaModel {

    constructor() {
        this.corridas = [];
    }

    criar(corrida) {
        const novaCorrida = {
            id: this.corridas.length + 1,

            passageiroId: corrida.passageiroId,
            motoristaId: corrida.motoristaId,

            origem: corrida.origem,
            destino: corrida.destino,

            formaPagamento: corrida.formaPagamento,

            status: corrida.status || "solicitada"
        };

        this.corridas.push(novaCorrida);

        return novaCorrida;
    }

    listar() {
        return this.corridas;
    }

    buscarPorId(id) {
        return this.corridas.find(corrida => corrida.id === id);
    }

    atualizarStatus(id, novoStatus) {
        const corrida = this.buscarPorId(id);

        if (!corrida) {
            return null;
        }

        corrida.status = novoStatus;

        return corrida;
    }
}

module.exports = new CorridaModel();