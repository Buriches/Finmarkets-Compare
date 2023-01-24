interface ICRUDController{
    create(req:any, res:any): Promise<void>,
    getAll(req:any, res:any): Promise<void>,
    getOne(req:any, res:any): Promise<void>,
    update(req:any, res:any): Promise<void>,
    delete(req:any, res:any): Promise<void>,
}

interface ICRUDService{
    create(body:any): Promise<IStatusResponse>,
    getAll(): Promise<IStatusResponse>,
    getOne(id:number): Promise<IStatusResponse>,
    update(body:any): Promise<IStatusResponse>,
    delete(id:number): Promise<IStatusResponse>,
}

interface IStatusResponse{
    status: number,
    response: any
}

export { ICRUDController, IStatusResponse, ICRUDService }