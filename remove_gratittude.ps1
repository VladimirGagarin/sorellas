# remove_gratittude.ps1 — deletes only the 12 (category=="Gratittude", double-t) quote objects from Utils.js
$ErrorActionPreference = "Stop"
$target = "C:\Emily_Backup\Desktop\cottolengo-suors\src\components\Utils.js"
$bak    = "C:\Emily_Backup\Desktop\cottolengo-suors\src\components\Utils.js.before_gratittude_fix.bak"

$u = Get-Content -LiteralPath $target
Write-Output ("   lines before = {0}" -f $u.Count)

$catRe   = [regex]'^\s*category:\s*"Gratittude"\s*,?\s*$'
$closeRe = [regex]'^\s*\},\s*$'

# Find every category-line of the WRONG spelling, then walk to the object's closing "},"
$ranges = New-Object System.Collections.Generic.List[object]
for($i=0; $i -lt $u.Count; $i++){
  if($u[$i] -match $catRe){
    $start = $i
    $end   = -1
    for($j=$i+1; $j -lt [Math]::Min($u.Count, $i+12); $j++){
      if($u[$j] -match $closeRe){ $end = $j; break }
    }
    if($end -lt 0){
      Write-Output ("   ERROR: no close within 12 lines after category at L{0}" -f ($i+1))
      exit 1
    }
    $ranges.Add([pscustomobject]@{ Start=$start; End=$end })
  }
}

Write-Output ("   wrong-Gratittude objects found = {0}" -f $ranges.Count)
if($ranges.Count -ne 12){
  Write-Output "   ABORT: expected exactly 12; nothing changed."
  exit 1
}

# order ranges descending so earlier indices stay valid as we splice
$desc = $ranges | Sort-Object Start -Descending
foreach($r in $desc){ $u = $u[0..($r.Start-1)] + $u[($r.End+1)..($u.Count-1)] }

# integrity self-check
$g = ($u | Select-String -SimpleMatch 'category: "Gratittude"').Count
Write-Output ("   wrong-Gratittude objects after = {0}" -f $g)
if($g -ne 0){ Write-Output "   ABORT: splice failed guard; file NOT saved."; exit 1 }
$good = ($u | Select-String -SimpleMatch 'category: "Gratitude"').Count
Write-Output ("   correct-Gratitude objects after = {0} (expected 64, unchanged)" -f $good)

Copy-Item -LiteralPath $target -Destination $bak -Force
Set-Content -LiteralPath $target -Value $u -Encoding utf8
Write-Output ("   WRITTEN. lines after = {0}" -f $u.Count)
Write-Output ("   backup = {0}" -f $bak)
