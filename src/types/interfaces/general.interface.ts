namespace GeneralRequests {
  export interface getAll {
    count: number,
    page: number
  }

  export interface getOne {
    id: string
  }

  export interface getOneByName {
    name: string
  }

  export interface deleteOne {
    id: string
  }
}
export default GeneralRequests
