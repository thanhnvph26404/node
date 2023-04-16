import Book from "../models/book";
import { bookSchema } from "../schema/book";
export const create = async (req, res) => { 
    try {
        const { error } = bookSchema.validate(req.body)
        if (error) {
            res.message = error.details.message
        }
        const book = await Book.create(req.body)
        if (!book) {
            return res.status(404).json({
                message: 'Product not created',
            })
        }
        return res.status(201).json(book)
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

export const update = async (req, res) => { 
    try {
        const { error } = bookSchema.validate(req.body)
        if (error) {
            res.message = error.details.message
        }
        const book = await Book.findByIdAndUpdate(req.params.id ,req.body)
        if (!book) {
            return res.status(404).json({
                message: 'Product not found',
            })
        }
        return res.status(201).json(book)
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

export const getAll = async (req, res) => { 
    const { _page = 1, _limit = 20, _sort = 'createAt', _order = 'asc' } = req.query
    const options = {
        page: _page,
        limit: _limit,
        sort: {
            [_sort]: _order === 'desc' ? -1 : 1,
        }
    }
    try {
        
        const {docs: book} = await Book.paginate({}, options)
        if (book.length == 0) {
            return res.status(404).json({
                message: 'Product not found',
            })
        }
        return res.status(201).json(book)
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

export const get = async (req, res) => { 
    try {
        
        const book = await Book.findById(req.params.id)
        if (!book) {
            return res.status(404).json({
                message: 'Product not found',
            })
        }
        return res.status(201).json(book)
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

export const remove = async (req, res) => { 
    try {
        
        const book = await Book.findByIdAndDelete(req.params.id)
        if (!book) {
            return res.status(404).json({
                message: 'Product not found',
            })
        }
        return res.status(201).json({message: 'Product deleted'})
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}
