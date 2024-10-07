export type CategoryType={
    id:number,
    attributes:{
        categoryName:string,
        slug:string,
        Categoryimage:{
            data:{
                attributes:{
                    url:string
                }
            }
        }
    }
}