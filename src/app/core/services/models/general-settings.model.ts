export type AbnormalFlagStyle = 'none' | 'hl-star' | 'arrows' | 'star';

export interface GeneralSettingsModel {
  abnormalFlagStyle: AbnormalFlagStyle;
  samplingListPagePerSample: boolean;
}
