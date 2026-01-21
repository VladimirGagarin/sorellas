import React from "react";
import { faHome, faBars } from "react-icons";

export default function Header() { 
    return (
        <header>
            <nav>
                <ul><li><a href="/home"><faHome /></a></li></ul>
                <ul><li><a href=""><faBars /></a></li></ul>
            </nav>
        </header>

    )
}