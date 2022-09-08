import {IBorrower} from "../people";
import {IThing} from "../things";
import {ILoan} from "../loans";
import {IWaitingList} from "../waitingLists";
import {Person} from "../people";
import {IEntity} from "../IEntity";
import {ILocation, IMoney, DueDate, ThingTitle} from "../../valueItems"

export interface ILibrary extends IEntity{
    readonly name: string
    readonly allTitles: Iterable<ThingTitle>
    readonly borrowers: Iterable<IBorrower>
    readonly administrator: Person
    readonly availableTitles: Iterable<ThingTitle>
    readonly location: ILocation

    canBorrow(borrower: IBorrower): boolean

    borrow(item: IThing, borrower: IBorrower, until: DueDate): ILoan

    startReturn(loan: ILoan): ILoan
    finishReturn(loan: ILoan): ILoan

    // reserve the next available item
    reserveItem(item: IThing, borrower: IBorrower): IWaitingList
    bidToSkipToFrontOfList(item: IThing, bidder: IBorrower, amount: IMoney, borrower?: IBorrower): IWaitingList
}