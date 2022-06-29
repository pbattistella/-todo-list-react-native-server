const Pool = require('pg').Pool
const db = new Pool({
    host: 'localhost',
    database: 'todolist_db',
    user: 'postgres',
    password: 'changeme',
    port: 5432
})

const getTasks = (request, response) => {
    db.query('SELECT * FROM task ORDER BY data_tarefa',
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
}

const getTaskById = (request, response) => {
    const id = parseInt(request.params.id)

    db.query('SELECT * FROM task WHERE id = $1',
        [id], (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        }
    )
}

const createTask = (request, response) => {
    try {
        const { descricao, data_tarefa } = request.body

        db.query('INSERT INTO task (descricao, data_tarefa) '
            + 'VALUES($1, $2)', [descricao, data_tarefa],
            (error, results) => {
                if (error) {
                    throw error
                }
                response.status(201).send('Tarefa adicionada')
            })
    }catch(error){
        console.log("Erro: " + error)
        response.status(400).send({
            status:400,
            message:'Erro ao inserir o registro. ' + error
        })
    }
}

const updateTask = (request, response) => {
    try{
        const id = parseInt(request.params.id)
        const {descricao, data_tarefa} = request.body

        db.query('UPDATE task SET descricao=$1, data_tarefa=$2 '
        + 'WHERE id=$3',[descricao, data_tarefa, id],
        (error, results) => {
            if (error){
                throw error
            }
            response.status(201).send('Tarefa atualizada com sucesso!')
        })

    }catch(error){
        response.status(400).send({
            status: 400,
            message: 'Erro ao atualizar o registro. ' + error
        })
    }
}

const deleteTask = (request, response) => {
    try{
        const id = parseInt(request.params.id)

        db.query('DELETE FROM task WHERE id = $1', [id],
        (error, results) => {
            if (error){
                throw error
            }
            response.status(200).send('Tarefa deletada com sucesso')
        })
    }catch(error){
        console.log("Erro: " + error)
        response.status(400).send({
            status: 400,
            message: 'Erro ao deletar o usuáro.' + error
        })
    }
}

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
}