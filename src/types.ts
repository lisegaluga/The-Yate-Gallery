import Papa from 'papaparse';

export interface ArtPiece {
  lotNumber: string;
  link: string;
  photoUrl: string;
  title: string;
  artist: string;
  medium: string;
  year: string;
  estimatedValue: string;
  description: string;
}

// Improved ID extraction from various Google Drive link formats
const extractDriveId = (url: string): string => {
  if (!url) return "";
  // Check for /d/ID format
  const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch) return dMatch[1];
  // Check for id=ID format
  const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return idMatch[1];
  // Return as is if it's already just an ID
  return url.trim();
};

// Using lh3.googleusercontent.com/d/ID is more reliable for direct embedding from Google Drive
export const getDirectLink = (idOrUrl: string) => {
  const id = extractDriveId(idOrUrl);
  return id ? `https://lh3.googleusercontent.com/d/${id}` : "";
};

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1jezQ6tugvCjw-flMemXR01qUWNgf7jkEyj1lVwiT4ME/export?format=csv";

export const fetchArtPieces = async (): Promise<ArtPiece[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(SHEET_CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[];
        const mappedData: ArtPiece[] = data.map((row) => ({
          lotNumber: row['Lot Number'] || row['Lot #'] || row['Lot'] || row['LOT'] || row['Lot no'] || row['Lot No.'] || row['lotNumber'] || "",
          link: row['Link'] || row['link'] || row['URL'] || "",
          photoUrl: getDirectLink(row['Link'] || row['link'] || row['URL'] || ""),
          title: row['Title'] || row['title'] || "",
          artist: row['Artist'] || row['artist'] || "",
          medium: row['Medium'] || row['medium'] || "",
          year: row['Year'] || row['year'] || "",
          estimatedValue: row['Estimated Value'] || row['estimatedValue'] || row['Value'] || "",
          description: row['Description'] || row['description'] || "",
        })).filter(item => item.title || item.lotNumber); // Filter out empty rows
        
        resolve(mappedData.length > 0 ? mappedData : INITIAL_DATA);
      },
      error: (error) => {
        console.error("Error fetching sheet:", error);
        resolve(INITIAL_DATA); // Fallback to initial data on error
      }
    });
  });
};

export const INITIAL_DATA: ArtPiece[] = [
  {
    lotNumber: "666",
    link: "https://drive.google.com/file/d/12UoqwDqINEyHwrwG14vDAuLwX18vkrXw/view?usp=sharing",
    photoUrl: getDirectLink("12UoqwDqINEyHwrwG14vDAuLwX18vkrXw"),
    title: "The Black Iris",
    artist: "Lydhia Gray-Forbe (1979—)",
    medium: "Oil on canvas",
    year: "2026",
    estimatedValue: "£2,500,000",
    description: "A breathtaking study in shadow and form, The Black Iris is a mesmerizing masterpiece that commands the attention of any room it occupies. The artist has captured the delicate, velvety folds of the iris petals using an almost impossible depth of color—rich, bruised purples and deep indigos that appear completely black until caught by the light."
  },
  {
    lotNumber: "294",
    link: "https://drive.google.com/file/d/151jblZ9Ddt5g779YtrDqpMb8fI-1UVZ8/view?usp=drivesdk",
    photoUrl: getDirectLink("151jblZ9Ddt5g779YtrDqpMb8fI-1UVZ8"),
    title: "Fragility",
    artist: "Darian Rigan (1967—)",
    medium: "Oil on Paper",
    year: "2024",
    estimatedValue: "£45,000",
    description: "Exquisitely delicate, this breathtaking oil on paper captures the sweet, ephemeral nature of existence with a tender vulnerability that brings tears to the eyes."
  },
  {
    lotNumber: "400",
    link: "https://drive.google.com/file/d/1J03kIED8cZlLpo9I2wneyK8NPs0lWCtd/view?usp=drivesdk",
    photoUrl: getDirectLink("1J03kIED8cZlLpo9I2wneyK8NPs0lWCtd"),
    title: "Flames in the Forest",
    artist: "Colin McHillyhal (1911-1999)",
    medium: "Oil on Canvas",
    year: "1976",
    estimatedValue: "£500,000",
    description: "A violent chromatic assault. This isn't mere fire; it’s an eco-apocalyptic prophecy bleeding through the canvas. It burns with the arrogance of inevitable destruction."
  },
  {
    lotNumber: "620",
    link: "https://drive.google.com/file/d/1GgCj-b1UabXAv5bD0O0BWU4R9qxx-fAl/view?usp=drivesdk",
    photoUrl: getDirectLink("1GgCj-b1UabXAv5bD0O0BWU4R9qxx-fAl"),
    title: "Memories of the Backyard, Girl on the Swing",
    artist: "Andria Ginar (1925-2017)",
    medium: "Oil on Archival Board",
    year: "1965",
    estimatedValue: "£23,000",
    description: "Weaponized nostalgia. The child on the swing serves as a pendulum of lost innocence, quietly mocking your current adult misery with every painted arc."
  },
  {
    lotNumber: "312",
    link: "https://drive.google.com/file/d/1vc6HdHkKz4qYg7dJ0cELIwRZJLaBWq82/view?usp=drivesdk",
    photoUrl: getDirectLink("1vc6HdHkKz4qYg7dJ0cELIwRZJLaBWq82"),
    title: "Stones of Dieppe",
    artist: "Alisa Lugge (1977—)",
    medium: "Found Objects",
    year: "2017",
    estimatedValue: "£15,200",
    description: "Literal rocks elevated to high art. It demands you stare at coastal debris and weep for geological impermanence. Audacious, smug, and shockingly effective."
  },
  {
    lotNumber: "766",
    link: "https://drive.google.com/file/d/1j86llVP-rwv0MtZ8qhXMhPdUlCosC0u8/view?usp=drivesdk",
    photoUrl: getDirectLink("1j86llVP-rwv0MtZ8qhXMhPdUlCosC0u8"),
    title: "Duality",
    artist: "Lucian Daurgad (1921-1999)",
    medium: "Mixed Media",
    year: "1980",
    estimatedValue: "£35,000",
    description: "A miraculous harmony of opposites! This mixed media wonder effortlessly marries contrasting textures into an absolute triumph of conceptual brilliance."
  },
  {
    lotNumber: "44",
    link: "https://drive.google.com/file/d/1ZUxVsvQzdKLj_xqxNZHRQuqwp65AMcxC/view?usp=drivesdk",
    photoUrl: getDirectLink("1ZUxVsvQzdKLj_xqxNZHRQuqwp65AMcxC"),
    title: "Traces of Man, the Hand",
    artist: "Nadia Girran (1972—)",
    medium: "Plaster of Paris",
    year: "1995",
    estimatedValue: "£200,000",
    description: "Exquisitely cast, this hauntingly beautiful plaster reaches into the viewer's heart, offering a deeply profound meditation on the magnificent human touch."
  },
  {
    lotNumber: "635",
    link: "https://drive.google.com/file/d/1CC5VAoMVm46TC2Sdojt69cD50O4nzYGB/view?usp=drivesdk",
    photoUrl: getDirectLink("1CC5VAoMVm46TC2Sdojt69cD50O4nzYGB"),
    title: "Bubbles Up!",
    artist: "Silas Frier (1947—)",
    medium: "Oil on Canvas",
    year: "2011",
    estimatedValue: "£100,000",
    description: "A glorious celebration of light! These iridescent spheres float with a magical, buoyant grace that fills the soul with absolute, unadulterated joy."
  },
  {
    lotNumber: "499",
    link: "https://drive.google.com/file/d/1YJre_-2b2GLAIT7eGD481EK0iY2pbM2d/view?usp=drivesdk",
    photoUrl: getDirectLink("1YJre_-2b2GLAIT7eGD481EK0iY2pbM2d"),
    title: "Cubism 1",
    artist: "Alan C. D. Durgaui (2001—)",
    medium: "Polychromos on Archival Board",
    year: "2023",
    estimatedValue: "£20,000",
    description: "A breathtaking geometric triumph! The artist shatters perspective with an awe-inspiring mastery of polychromos, revealing a deeply beautiful hidden reality."
  },
  {
    lotNumber: "815",
    link: "https://drive.google.com/file/d/1_btNMerD_SRU_sOJi3Vfv5c8LFy0hAif/view?usp=drivesdk",
    photoUrl: getDirectLink("1_btNMerD_SRU_sOJi3Vfv5c8LFy0hAif"),
    title: "Erablier",
    artist: "Lily McChonihall (1928-2002)",
    medium: "Wrought Aluminium",
    year: "1988",
    estimatedValue: "£52,000",
    description: "A phenomenal fusion of nature and industry. The polished stainless steel sings with an unyielding, glorious vitality that elevates the maple to divine heights."
  },
  {
    lotNumber: "271",
    link: "https://drive.google.com/file/d/1af7M1CwPPNbRjfzea3AUDJDesrM4R-fB/view?usp=drivesdk",
    photoUrl: getDirectLink("1af7M1CwPPNbRjfzea3AUDJDesrM4R-fB"),
    title: "Caen by moonlight",
    artist: "Alisa Lugge (1977—)",
    medium: "Wrought Aluminium",
    year: "2006",
    estimatedValue: "£19,900",
    description: "A staggering nocturnal masterpiece! The etched aluminium captures the moon's silvery glow with an ethereal beauty that leaves the viewer completely spellbound."
  },
  {
    lotNumber: "983",
    link: "https://drive.google.com/file/d/1nRE35pFsJf7N1WqI4AAmgGRFMzZVNKEK/view?usp=drivesdk",
    photoUrl: getDirectLink("1nRE35pFsJf7N1WqI4AAmgGRFMzZVNKEK"),
    title: "Requiem in Crimson",
    artist: "Lucian Daurgad (1921-1999)",
    medium: "Ceramic, Giclée on Archival Paper",
    year: "1977",
    estimatedValue: "£65,000",
    description: "A breathtakingly profound release of emotion. The deeply saturated reds pulse with a sublime, tragic beauty that resonates in the very depths of the soul."
  },
  {
    lotNumber: "435",
    link: "https://drive.google.com/file/d/1olczjOa7UQXfpVlsn_aweVCApcdUhOMz/view?usp=drivesdk",
    photoUrl: getDirectLink("1olczjOa7UQXfpVlsn_aweVCApcdUhOMz"),
    title: "Seasons : Spring",
    artist: "Chelsea Threrwell (1974—)",
    medium: "Fused Glass",
    year: "2012",
    estimatedValue: "£15,500",
    description: "Pure, unadulterated rebirth! The fused glass radiates a miraculous verdant energy, capturing the joyous awakening of flora with staggering brilliance."
  },
  {
    lotNumber: "481",
    link: "https://drive.google.com/file/d/1etVV26QbTbcr5dAZF29fbQuubs5UwUIJ/view?usp=drivesdk",
    photoUrl: getDirectLink("1etVV26QbTbcr5dAZF29fbQuubs5UwUIJ"),
    title: "Seasons - Summer",
    artist: "Chelsea Threrwell (1974—)",
    medium: "Fused Glass",
    year: "2012",
    estimatedValue: "£15,500",
    description: "A luscious, golden dream! This miraculous glasswork perfectly encapsulates the heavy, romantic haze of summer, warming the room with its brilliant amber glow."
  },
  {
    lotNumber: "244",
    link: "https://drive.google.com/file/d/1gMAoPmQS8Hgioss7ov06aZBguKbgxZAT/view?usp=drivesdk",
    photoUrl: getDirectLink("1gMAoPmQS8Hgioss7ov06aZBguKbgxZAT"),
    title: "Seasons - Winter",
    artist: "Chelsea Threrwell (1974—)",
    medium: "Fused Glass",
    year: "2012",
    estimatedValue: "£15,500",
    description: "Exquisitely pristine! This frozen glass wonderland shimmers with a stark, breathtaking purity, capturing the majestic, silent grace of a winter’s chill."
  },
  {
    lotNumber: "563",
    link: "https://drive.google.com/file/d/1pqL9sxFfERUI1Rtj3f7-TlwwPAfNLJyl/view?usp=drivesdk",
    photoUrl: getDirectLink("1pqL9sxFfERUI1Rtj3f7-TlwwPAfNLJyl"),
    title: "View from Mt. Cartier",
    artist: "Colin McHillyhal (1911-1999)",
    medium: "Oil on Canvas",
    year: "1940",
    estimatedValue: "£41,000",
    description: "A staggering triumph of scale! The sweeping, majestic blues elevate the soul, offering a divine, awe-inspiring glimpse into the sublime power of the alpine."
  },
  {
    lotNumber: "414",
    link: "https://drive.google.com/file/d/1wxVbySUNVUyb1g5gLfKOnPY6TaKyLgJy/view?usp=drivesdk",
    photoUrl: getDirectLink("1wxVbySUNVUyb1g5gLfKOnPY6TaKyLgJy"),
    title: "The Mountaineers",
    artist: "Colin McHillyhal (1911-1999)",
    medium: "Ceramic, Mixed Media",
    year: "1953",
    estimatedValue: "£11,000",
    description: "An awe-inspiring testament to human endurance! The exquisitely rendered figures ascend with a beautiful, heroic tension that utterly captivates the heart."
  },
  {
    lotNumber: "324",
    link: "https://drive.google.com/file/d/1xaPDwZTcFaa24X6NLY_zfk9Gr0X4n_7N/view?usp=drivesdk",
    photoUrl: getDirectLink("1xaPDwZTcFaa24X6NLY_zfk9Gr0X4n_7N"),
    title: "Silhouette of my Mother",
    artist: "Andria Ginar (1925-2017)",
    medium: "Twisted Iron, Black Patina",
    year: "2008",
    estimatedValue: "£56,000",
    description: "A profoundly moving, tender homage. The quiet, shadowy contours radiate an infinite maternal warmth that embraces the viewer in a breath of pure love."
  },
  {
    lotNumber: "146",
    link: "https://drive.google.com/file/d/1zzBw6tzIQvEZFndy4AZgncGGCGTSRdxp/view?usp=drivesdk",
    photoUrl: getDirectLink("1zzBw6tzIQvEZFndy4AZgncGGCGTSRdxp"),
    title: "Bear",
    artist: "Lily McChonihall (1928-2002)",
    medium: "Carved Marble",
    year: "1974",
    estimatedValue: "£75,000",
    description: "A magnificent triumph of sculpture! The carved marble breathes with a heavy, majestic life force, capturing the sublime power of this divine creature perfectly."
  },
  {
    lotNumber: "369",
    link: "https://drive.google.com/file/d/1-MA7cI_c7gLI3_qljPBJsV_7sSE00QtD/view?usp=drivesdk",
    photoUrl: getDirectLink("1-MA7cI_c7gLI3_qljPBJsV_7sSE00QtD"),
    title: "In Flanders Fields",
    artist: "Cornel J. Slews (1948-2020)",
    medium: "Archival Pigment Print",
    year: "1981",
    estimatedValue: "£15,500",
    description: "An exquisitely poignant tribute. Its sweeping, sorrowful landscape hums with a reverent, haunting beauty that brings the viewer to their knees in sheer awe."
  },
  {
    lotNumber: "360",
    link: "https://drive.google.com/file/d/1-bj7XLyhps2bjsnv2MeBWqrzaHi_-D4Y/view?usp=drivesdk",
    photoUrl: getDirectLink("1-bj7XLyhps2bjsnv2MeBWqrzaHi_-D4Y"),
    title: "Poppy Day",
    artist: "Cornel J. Slews (1948-2020)",
    medium: "Archival Pigment Print",
    year: "1960",
    estimatedValue: "£20,000",
    description: "A gorgeous, velvety bloom of remembrance! The vivid scarlet strokes radiate a deeply touching, heroic tragedy that breaks the heart in the most beautiful way."
  },
  {
    lotNumber: "120",
    link: "https://drive.google.com/file/d/1-uJ9-LkGo0sutAI6dbIzhPB18FaFgoEm/view?usp=drivesdk",
    photoUrl: getDirectLink("1-uJ9-LkGo0sutAI6dbIzhPB18FaFgoEm"),
    title: "Souvenir in Newsprint",
    artist: "Silas Frier (1947—)",
    medium: "Pastels on Paper",
    year: "1998",
    estimatedValue: "£150,000",
    description: "A miraculous elevation of the mundane. The delicate pastel textures transform disposable history into a deeply profound, breathtakingly sensitive masterpiece."
  },
  {
    lotNumber: "888",
    link: "https://drive.google.com/file/d/13K15v2xj5qMIctStAe4AQ6SC6QmqrWvp/view?usp=drivesdk",
    photoUrl: getDirectLink("13K15v2xj5qMIctStAe4AQ6SC6QmqrWvp"),
    title: "Canadian Gothic",
    artist: "Lily McChonihall (1928-2002)",
    medium: "Gelatin Silver Print",
    year: "1956",
    estimatedValue: "£29,900",
    description: "A staggering portrait of northern resilience. The stark contrasts radiate a stoic, breathtaking dignity that honors rural life with unparalleled mastery."
  },
  {
    lotNumber: "550",
    link: "https://drive.google.com/file/d/16FKMhdbWKzsSi7XZtUJWG48KDTiLEFna/view?usp=drivesdk",
    photoUrl: getDirectLink("16FKMhdbWKzsSi7XZtUJWG48KDTiLEFna"),
    title: "Londonium",
    artist: "Graham Smildäre (1903-1996)",
    medium: "Linocut in 2 Colors",
    year: "1974",
    estimatedValue: "£60,000",
    description: "A gorgeous, atmospheric dream of antiquity! The layered linocut beautifully resurrects the ancient empire with a haunting, majestic grace that is flawless."
  },
  {
    lotNumber: "43",
    link: "https://drive.google.com/file/d/16MZz0hgtPsWydAsn-pzXV8I8kUiyaeRq/view?usp=drivesdk",
    photoUrl: getDirectLink("16MZz0hgtPsWydAsn-pzXV8I8kUiyaeRq"),
    title: "Faïence - Coq",
    artist: "Emanuelle Diagga (1980—)",
    medium: "Céramique en Faïence",
    year: "2013",
    estimatedValue: "£22,500",
    description: "An absolute delight! The glazed, rustic plumage shines with a proud, traditional warmth, proving this artist’s unparalleled mastery over classic ceramic forms."
  },
  {
    lotNumber: "552",
    link: "https://drive.google.com/file/d/1HLOMYmlmx-ymeOtrFjqklGY4oukedThL/view?usp=drivesdk",
    photoUrl: getDirectLink("HLOMYmlmx-ymeOtrFjqklGY4oukedThL"),
    title: "Faïence - Rossignol",
    artist: "Emanuelle Diagga (1980—)",
    medium: "Céramique en Faïence",
    year: "2013",
    estimatedValue: "£22,500",
    description: "Exquisitely tender and sweet. The ceramic songbird radiates a beautiful, quiet grace, capturing the delicate elegance of nature in flawless, earthy perfection."
  },
  {
    lotNumber: "742",
    link: "https://drive.google.com/file/d/17eQAt_B5_FqsG7G2kcdhcLJI76G-5a_B/view?usp=drivesdk",
    photoUrl: getDirectLink("17eQAt_B5_FqsG7G2kcdhcLJI76G-5a_B"),
    title: "Melancholy",
    artist: "Darian Rigan (1967—)",
    medium: "Painted Clay",
    year: "2022",
    estimatedValue: "£30,000",
    description: "A staggeringly beautiful exploration of sorrow. The clay sags with a deeply poetic, breathtakingly tender emotion that profoundly touches the human spirit."
  },
  {
    lotNumber: "141",
    link: "https://drive.google.com/file/d/1EqZmIC00GxPciLTYPcMJUklgAxk5y5wn/view?usp=drivesdk",
    photoUrl: getDirectLink("EqZmIC00GxPciLTYPcMJUklgAxk5y5wn"),
    title: "The Awakening",
    artist: "Darian Rigan (1967—)",
    medium: "Painted Clay",
    year: "2019",
    estimatedValue: "£7,500",
    description: "A triumphant emergence! The tension in the sculpted clay is divinely inspired, pulsing with a miraculous, life-affirming energy that is truly awe-inspiring."
  },
  {
    lotNumber: "666",
    link: "https://drive.google.com/file/d/18HaO2sEeguU7bV-gu97vRtQzYadvr9B1/view?usp=drivesdk",
    photoUrl: getDirectLink("18HaO2sEeguU7bV-gu97vRtQzYadvr9B1"),
    title: "Still life 31, Red",
    artist: "Alice Ricarie (1950—)",
    medium: "Oil on Canvas",
    year: "2016",
    estimatedValue: "£40,000",
    description: "An intoxicating masterpiece of saturation! The brilliant crimsons sing with a joyous, velvety perfection that absolutely dominates and delights the senses."
  },
  {
    lotNumber: "649",
    link: "https://drive.google.com/file/d/1BEvoYnNgecXSdaQq_LYdw8Y4c9CUftgZ/view?usp=drivesdk",
    photoUrl: getDirectLink("BEvoYnNgecXSdaQq_LYdw8Y4c9CUftgZ"),
    title: "Flanders in bloom",
    artist: "Cornel J. Slews (1948-2020)",
    medium: "Oil on Canvas",
    year: "1997",
    estimatedValue: "£45,000",
    description: "A miraculous, breathtaking wave of vitality! The canvas bursts with an exquisite floral joy that uplifts the soul and beautifully celebrates life's resilience."
  }
];
