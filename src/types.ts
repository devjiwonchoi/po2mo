export type Po2MoConfig = {
  files: {
    input: string
    output: string
  }[]
}

export type CliArgs = {
  input?: string
  config?: string
  output?: string
  cwd?: string
  help?: boolean
  version?: boolean
  recursive: boolean
}
