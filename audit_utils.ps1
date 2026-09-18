$ErrorActionPreference = "Stop"
$target = "C:\Emily_Backup\Desktop\cottolengo-suors\src\components\Utils.js"
$u = Get-Content -LiteralPath $target
Write-Output ("[audit] lines total = {0}" -f $u.Count)

$wrong = ($u | Select-String -SimpleMatch 'category: "Gratittude"').Count
$right = ($u | Select-String -SimpleMatch 'category: "Gratitude"').Count
Write-Output ("[audit] wrong Gratittude (double-t) = {0}   correct Gratitude (single-t) = {1}" -f $wrong, $right)

function CountAdjacent([string]$author, [string]$category) {
  $n = 0
  for ($i = 0; $i -lt $u.Count - 1; $i++) {
    if ($u[$i] -like "*author: `"$author`"*" -and $u[$i + 1] -like "*category: `"$category`"*") { $n++ }
  }
  return $n
}

foreach ($pair in @(
  @("Sr. Hannah", "Peace"),
  @("Sr. Mary Carrolla", "Peace"),
  @("Sr. Nancy", "Peace"),
  @("Sr. Mary Carrolla", "Kindness")
)) {
  $a = $pair[0]; $c = $pair[1]
  $n = CountAdjacent $a $c
  Write-Output ("[audit] author='{0}' category='{1}' -> {2} object(s)" -f $a, $c, $n)
}
