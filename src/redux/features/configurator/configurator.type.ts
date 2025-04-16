import {
  IConfiguration,
  ICoordinates,
  IQuaternion,
} from "@threekit-tools/treble/dist/types";

export interface IAttributeAssetValues {
  assetId: string;
  enabled: boolean;
  fileSize: number;
  handleSelect: () => unknown;
  label: string;
  metadata: {
    [key: string]: string;
  };
  name: string;
  selected: boolean;
  tagids: string[];
  tags: string[];
  type: string;
  visible: boolean;
}

export interface IAttributeAsset {
  assetType: string;
  blacklist: unknown[];
  defaultValue: { assetId: string; type: string }[];
  disabledValues: unknown[];
  enabled: boolean;
  global: {
    defaultValue: { assetId: string; type: string };
    id: string;
    metadata: unknown[];
    name: string;
    type: string;
  };
  hiddenValues: unknown[];
  id: string;
  label: string;
  metadata: {
    [key: string]: string;
  };
  name: string;
  type: string;
  value: {
    assetId: string;
    configuration: unknown;
    metadata: { [key: string]: string };
    name: string;
    tags: string[];
    type: string;
  };
  values: IAttributeAssetValues[];
  visible: boolean;
}

export interface CameraI {
  initialPosition?: ICoordinates;
  initialQuaternion?: IQuaternion;
}
export interface ConfiguratorState {
  isLoadingConfiguration: boolean;
  defaultConfiguration: null | IConfiguration;
  stageCamera: number;
  listAttributes: IAttributeAsset[];
  selectedAttributes: { assetId: string; name: string }[];
}
