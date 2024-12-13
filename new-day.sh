#!/bin/bash

# Lots of syntax inside is defined by the POSIX standard:
# https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html
#
# Bash-specific stuff is defined in the bash manual:
# https://www.gnu.org/software/bash/manual/bash.html

# If trace is set, print out commands and args as they run.
[[ "${TRACE:+1}" ]] && set -o xtrace
set -o nounset
set -o pipefail

# Thanks S.O. https://stackoverflow.com/a/246128. There is no trailing /
this_script_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"

main() {
	day="${1:?}"

	cp "${this_script_directory}/aoc/dayn.ts" "${this_script_directory}/aoc/day${day}.ts"
	touch "${this_script_directory}/aoc/test_inputs/day${day}.txt"
	touch "${this_script_directory}/inputs/day${day}.txt"
}

main "$@"
