import { ChannelFromDataSource, ThreadFromDataSource } from "@/types";

// Returns channel data from the API.
// Omits "internal" properties that're only visible to the API adapter.
export default function getChannelData(channel: ChannelType): ChannelFromDataSource {
	const { threads, ...rest } = channel
	return rest
}

type ChannelType = ChannelFromDataSource & { threads: ThreadFromDataSource[] }