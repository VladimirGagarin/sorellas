import React from "react";
import { FaBars , FaHome} from "react-icons/fa";

export default function Header() { 
    return (
        <header>
            <nav>
                <ul><li><a href="/home"><FaHome /></a></li></ul>
                <ul><li><a href="/"><faBars /></a></li></ul>
            </nav>
        </header>

    )
}