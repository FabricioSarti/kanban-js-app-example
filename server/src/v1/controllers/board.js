const Board = require("../models/board")
const Section = require("../models/section")
const Task = require("../models/task")

exports.create = async (req, res) => {
    try {
        //en cada request va el token y la info del usuario req.user._id
        const boardsCount = await Board.find().count();
        const board = await Board.create({
            user: req.user._id,
            position: boardsCount > 0 ? boardsCount : 0
        })
        res.status(201).json(board)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.getAll = async (req, res) => {
    try {
        const boards = await Board.find({ user: req.user._id }).sort("-position");
        res.status(200).json(boards);
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.updatePosition = async (req, res) => {
    const { boards } = req.body
    try {
        for (const key in boards.reverse()) {
            const board = boards[key]
            await Board.findByIdAndUpdate(
                board.id,
                { $set: { position: key } }
            )
        }
        res.status(200).json('updated')
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.getOne = async (req, res) => {
    const { boardId } = req.params
    try {
        const board = await Board.findOne({ user: req.user._id, _id: boardId })
        if (!board) return res.status(404).json('Board not found')
        const sections = await Section.find({ board: boardId })
        for (const section of sections) {
            const tasks = await Task.find({ section: section.id }).populate('section').sort('-position')
            section._doc.tasks = tasks
        }
        board._doc.sections = sections
        res.status(200).json(board)
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.update = async (req, res) => {
    const { boardId } = req.params
    const { title, description, favourite } = req.body

    try {
        if (title === '') req.body.title = 'Untitled'
        if (description === '') req.body.description = 'Add description here'
        const currentBoard = await Board.findById(boardId)
        if (!currentBoard) return res.status(404).json('Board not found')

        if (favourite !== undefined && currentBoard.favourite !== favourite) {
            const favourites = await Board.find({
                user: currentBoard.user,
                favourite: true,
                _id: { $ne: boardId }
            }).sort('favouritePosition')
            if (favourite) {
                req.body.favouritePosition = favourites.length > 0 ? favourites.length : 0
            } else {
                for (const key in favourites) {
                    const element = favourites[key]
                    await Board.findByIdAndUpdate(
                        element.id,
                        { $set: { favouritePosition: key } }
                    )
                }
            }
        }

        const board = await Board.findByIdAndUpdate(
            boardId,
            { $set: req.body }
        )
        res.status(200).json(board)
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.getFavourites = async (req, res) => {
    try {
        const favourites = await Board.find({
            user: req.user._id,
            favourite: true
        }).sort('-favouritePosition')
        res.status(200).json(favourites)
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.updateFavouritePosition = async (req, res) => {
    const { boards } = req.body
    try {
        //aca se le manda todos los boards que ha cargado un usuario y se actualiza uno a uno su posicion
        for (const key in boards.reverse()) {
            const board = boards[key]
            await Board.findByIdAndUpdate(
                board.id,
                { $set: { favouritePosition: key } }
            )
        }
        res.status(200).json('updated')
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.delete = async (req, res) => {
    const { boardId } = req.params
    try {
        //este metodo elimina el board y se va en cadena hasta eliminar los tasks 
        const sections = await Section.find({ board: boardId })
        for (const section of sections) {
            await Task.deleteMany({ section: section.id })
        }
        await Section.deleteMany({ board: boardId })

        const currentBoard = await Board.findById(boardId)

        /*
        { $ne: boardId }: Esto es una expresión de filtro que utiliza el operador $ne (no es igual a). 
        Esta expresión verifica si el valor del campo _id no es igual al valor de boardId. En otras palabras, 
        esta consulta seleccionará todos los documentos cuyo campo _id sea diferente al valor de boardId.
        
        */

        if (currentBoard.favourite) {
            const favourites = await Board.find({
                user: currentBoard.user,
                favourite: true,
                _id: { $ne: boardId }
            }).sort('favouritePosition')

            /*
            $set es un operador de actualización en MongoDB que se utiliza para establecer o cambiar el valor de un campo en un documento.
                { favouritePosition: key } es un objeto que indica qué campo se debe actualizar y cuál debe ser su nuevo valor. En este caso:
                    favouritePosition es el nombre del campo que se está actualizando.
                key parece ser el nuevo valor que se establecerá en el campo favouritePosition.
            
            
            */
            for (const key in favourites) {
                const element = favourites[key]
                await Board.findByIdAndUpdate(
                    element.id,
                    { $set: { favouritePosition: key } }
                )
            }
        }

        await Board.deleteOne({ _id: boardId })

        const boards = await Board.find().sort('position')
        for (const key in boards) {
            const board = boards[key]
            await Board.findByIdAndUpdate(
                board.id,
                { $set: { position: key } }
            )
        }

        res.status(200).json('deleted')
    } catch (err) {
        res.status(500).json(err)
    }
}