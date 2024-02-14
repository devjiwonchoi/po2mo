export type Po2MoConfig = {
  tasks: {
    input: string
    output?: string
    recursive?: boolean
  }[]
}

export type CliArgs = {
  input?: string
  config?: string
  output?: string
  cwd?: string
  help?: boolean
  version?: boolean
  recursive?: boolean
}

export type ResolvedArgs = {
  input: string | null
  output: string | null
  cwd: string
  recursive: boolean
}