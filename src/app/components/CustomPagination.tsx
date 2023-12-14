import ReactPaginate from "react-paginate";

interface IProps {
    onPageChange: (e: any)=> void;
    totalPage: number;
    totalItems: number;
    limit: number;
    totalData: number;
    currentPage: number;
}
export const CustomPagination = (props: IProps) => {
    let startingNumber = props.currentPage === 1 ? 0 : (props.currentPage-1)*props.limit;
    let force = props.currentPage === 1 ? 0 : props.currentPage
    return(
        <div className="flex items-center justify-between">
            <div className="font-robotoregular text-sm text-primary">Menampilkan {props.totalData > 0 ? startingNumber+1 : 0}-{startingNumber+props.totalData} dari {props.totalItems}</div>
            <ReactPaginate
                breakLabel="..."
                nextLabel="selanjutnya"
                onPageChange={props.onPageChange}
                pageRangeDisplayed={2}
                pageCount={props.totalPage}
                previousLabel="sebelumnya"
                pageClassName='h-[35px] w-[35px] flex items-center justify-center font-robotoregular text-sm'
                activeClassName="text-white bg-primary"
                containerClassName="flex justify-end items-center"
                previousClassName="mr-1 font-robotoregular text-sm"
                nextClassName="ml-1 font-robotoregular text-sm"
                forcePage={force}
            />
        </div>
    );
}