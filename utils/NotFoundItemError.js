class NotFoundItemException extends Error {
    constructor(id)
    {
        super(`cant find item with given id ${id}`);
        // this.msg = `cant find item with given id ${id}`
        this.statusCode = 404;
    }
}


module.exports = NotFoundItemException;