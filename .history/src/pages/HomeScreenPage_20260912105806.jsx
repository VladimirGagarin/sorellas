import { useState, useEffect, useMemo } from "react";
import flowers from "../components/Flower";
import FlowerCard from "../components/FlowerCard.jsx";
import Header from "../components/Header.jsx";
import PrayerOverlay from "../components/PrayerOverlay.jsx"; // Add this import
import { useLanguage } from "../contexts/useLanguage.js";
import { FaSeedling, FaFilter, FaRandom, FaArrowUp } from "react-icons/fa";
import "./HomeScreen.css";

export default function HomeScreenPage() {
  const { language } = useLanguage();

  // random prayer card

  // random Quote card

  // cta garden
}