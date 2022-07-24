import joi from "joi";
import { connection } from "../dbStrategy/database.js";

export async function validateGame(req, res, next) {
    const gameSchema = joi.object({
        name: joi.string().required(),
        image: joi.string().required(),
        stockTotal: joi.number().integer().greater(0).required(),
        categoryId: joi.number().integer().greater(0).required(),
        pricePerDay: joi.number().integer().greater(0).required()
    });
    const game = req.body;
    const validation = gameSchema.validate(game);
    const { rows: findCategory} = await connection.query(`SELECT * FROM categories WHERE id = ${game.categoryId}`)
    
    if(validation.error) {
        return res.status(400).send(validation.error.details[0].message)
    }
    
    if(findCategory.length !== 1) {
        return res.status(400).send('Categoria não existe')
    }
    
    next();
}

export async function validateUniqueGame(req, res, next) {
    const { name } = req.body;
    const { rows: uniqueName } = await connection.query(`SELECT * FROM games WHERE name = '${name}'`);

    if(uniqueName.length > 0) {
        return res.status(409).send('Jogo já cadastrado.')
    }

    next();
}