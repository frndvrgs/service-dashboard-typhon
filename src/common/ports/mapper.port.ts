export interface MapperPort<ViewModel, EntityModel, DataModel> {
  mapDataToEntity(data: DataModel): EntityModel;
  mapEntityToData(entity: EntityModel): DataModel;
  mapDataToView(data: DataModel): ViewModel;
}
