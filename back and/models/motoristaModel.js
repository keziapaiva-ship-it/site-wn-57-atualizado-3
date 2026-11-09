class MotoristaModel {

    constructor() {
        this.motoristas = [];
    }

    criar(motorista) {
        const novoMotorista = {
            id: this.motoristas.length + 1,
            nome: motorista.nome,
            email: motorista.email,
            senha: motorista.senha,
            cnh: motorista.cnh
        };

        this.motoristas.push(novoMotorista);

        return novoMotorista;
    }

    listar() {
        return this.motoristas;
    }

    buscarPorEmail(email) {
        return this.motoristas.find(
            motorista => motorista.email === email
        );
    }

    buscarPorId(id) {
        return this.motoristas.find(
            motorista => motorista.id === id
        );
    }
}

module.exports = new MotoristaModel();