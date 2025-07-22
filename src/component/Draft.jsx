import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaEdit, FaToggleOn, FaToggleOff } from 'react-icons/fa'

const Draft = () => {
    const [note, setNote] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [editId, setEditId] = useState(null)
    const [editMessage, setEditMessage] = useState('')

    useEffect(() => {
        handleGetContractor()
    }, [])

    const handleGetContractor = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/getContractor`)
            const sortData = response.data.data.sort((a, b) => a.id - b.id)
            setNote(sortData)
        } catch (error) {
            console.error(error)
        }
    }

    const handleCreateContractor = async () => {
        if (!newMessage.trim()) return alert('กรุณากรอกข้อความ')
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/createContractor`, {
                message: newMessage
            })
            setNewMessage('')
            handleGetContractor()
        } catch (error) {
            console.error(error)
        }
    }

    const handleUpdateContractor = async (id) => {
        if (!editMessage.trim()) return alert('กรุณากรอกข้อความใหม่')
        try {
            await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/updateContractor`, {
                id,
                message: editMessage
            })
            setEditId(null)
            setEditMessage('')
            handleGetContractor()
        } catch (error) {
            console.error(error)
        }
    }

    const handleApproveContractor = async (id, currentStatus) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/approveContractor`, {
                id,
                isDelete: !currentStatus
            })
            handleGetContractor()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">บันทึกงานชั่วคราว</h1>

            <div className="flex gap-2 mb-4">
                <input
                    className="border p-2 rounded w-1/2"
                    type="text"
                    placeholder="เพิ่มข้อความบันทึกงานชั่วคราว"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={handleCreateContractor}
                >
                    เพิ่มข้อความ
                </button>
            </div>

            {note.length > 0 ? (
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2 text-left">ลำดับ</th>
                            <th className="border px-4 py-2 text-left">ข้อความ</th>
                            <th className="border px-4 py-2 text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {note.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">{item.id}</td>

                                <td className="border px-4 py-2">
                                    {editId === item.id ? (
                                        <input
                                            type="text"
                                            value={editMessage}
                                            onChange={(e) => setEditMessage(e.target.value)}
                                            className="border p-1 w-full"
                                        />
                                    ) : (
                                        item.message
                                    )}
                                </td>

                                <td className="border px-4 py-2 text-center flex gap-2 justify-center">
                                    {/* ปุ่ม toggle เปิด/ปิด */}
                                    <button onClick={() => handleApproveContractor(item.id, item.isDelete)}>
                                        {item.isDelete ? (
                                            <FaToggleOff className="text-red-500 text-xl" />
                                        ) : (
                                            <FaToggleOn className="text-green-500 text-xl" />
                                        )}
                                    </button>

                                    {/* ปุ่มแก้ไข */}
                                    {editId === item.id ? (
                                        <button
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                            onClick={() => handleUpdateContractor(item.id)}
                                        >
                                            บันทึก
                                        </button>
                                    ) : (
                                        <button
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={() => {
                                                setEditId(item.id)
                                                setEditMessage(item.message)
                                            }}
                                        >
                                            <FaEdit />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>ไม่มีข้อมูล</p>
            )}
        </div>
    )
}

export default Draft
