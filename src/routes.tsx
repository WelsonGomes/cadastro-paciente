// import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ListaPaciente from "./pages/listapaciente"

export default function Rotas() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/"  element={<ListaPaciente/>} />
            </Routes>
        </BrowserRouter>
    )
}