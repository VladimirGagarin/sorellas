$f = "C:\Emily_Backup\Desktop\cottolengo-suors\src\components\Utils.js"
$c = Get-Content $f
Write-Output "=== A) 18730-18742 ==="
foreach ($n in 18730..18742) { Write-Output ("{0}: {1}" -f $n, $c[$n-1]) }
Write-Output ""
Write-Output "=== B) 19078-19086 ==="
foreach ($n in 19078..19086) { Write-Output ("{0}: {1}" -f $n, $c[$n-1]) }
Write-Output ""
Write-Output "=== C) 20955-20970 ==="
foreach ($n in 20955..20970) { Write-Output ("{0}: {1}" -f $n, $c[$n-1]) }
