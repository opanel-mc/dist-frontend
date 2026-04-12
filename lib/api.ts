const BASE_URL = "https://opanel.hugo.net.cn";

export function getDownloadUrl(
  platform: string,
  minVersion: string,
  opanelVersion: string
) {
  return `${BASE_URL}/https://github.com/opanel-mc/opanel/releases/download/${opanelVersion}/opanel-${platform}-${minVersion}-build-${opanelVersion}.jar`;
}
