import { useDispatch } from "react-redux"
import { FiX } from "react-icons/fi"
import { setIsModalOn } from "../../redux/transactionSlice"

const ModalStatus = ({ update, setUpdate, onSubmit }) => {
    const dispatch = useDispatch()

    const handleCancelClick = () => {
        // setChoice(false);
        dispatch(setIsModalOn(false))
    }

    return (
        <>
            <div className="fixed inset-0 z-50 bg-gray-bg">
                <div className="flex h-screen items-center justify-center">
                    <div className="h-fit w-96 rounded-2xl bg-white p-8">
                        <div className="mb-4 flex justify-end">
                            <FiX
                                className="h-7 w-7 cursor-pointer rounded-full p-1 shadow hover:bg-gray"
                                onClick={handleCancelClick}
                            />
                        </div>
                        <div className="mb-8 space-y-6">
                            <form id="updateStatus" onSubmit={onSubmit}>
                                <div className="font-medium">
                                    Perbarui status penjualan produkmu
                                </div>
                                <div className="flex">
                                    <div className="flex h-5 items-center">
                                        <input
                                            className="h-4 w-4 appearance-none rounded-full bg-[#C4C4C4] checked:bg-primary-purple-04 hover:bg-primary-purple-05"
                                            type="radio"
                                            name="radio"
                                            value="COMPLETED"
                                            onChange={(e) => {
                                                setUpdate({
                                                    ...update,
                                                    status: e.target.value,
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="ml-4 space-y-2 text-sm">
                                        <label className="text-neutral-05">
                                            Berhasil terjual
                                        </label>
                                        <p className="text-xs text-neutral-03">
                                            Kamu telah sepakat menjual produk
                                            ini kepada pembeli
                                        </p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="flex h-5 items-center">
                                        <input
                                            className="h-4 w-4 appearance-none rounded-full bg-[#C4C4C4] checked:bg-primary-purple-04 hover:bg-primary-purple-05"
                                            type="radio"
                                            name="radio"
                                            value="REJECTED"
                                            onChange={(e) => {
                                                setUpdate({
                                                    ...update,
                                                    status: e.target.value,
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="ml-4 space-y-2 text-sm">
                                        <label className="text-neutral-05">
                                            Batalkan transaksi
                                        </label>
                                        <p className="text-xs text-neutral-03">
                                            Kamu membatalkan transaksi produk
                                            ini dengan pembeli
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <button
                            form="updateStatus"
                            className="w-full rounded-2xl bg-primary-purple-04 py-3.5 px-6 font-medium text-white hover:bg-primary-purple-05"
                        >
                            Kirim
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalStatus
