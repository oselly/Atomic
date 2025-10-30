CREATE TABLE [dbo].[tblTask]
(
	[TaskId]			INT					NOT NULL	IDENTITY(1,1) CONSTRAINT [PK_tblTask_TaskId] PRIMARY KEY CLUSTERED([TaskId] ASC) ON [PRIMARY],
	[Title]				NVARCHAR(100)		NOT NULL,
	[Description]		NVARCHAR(Max)		NULL,
	[DueDate]           DATETIME2 (0)		NULL,
	[AssignedToUserId]	INT					NULL		CONSTRAINT [FK_tblTask_AssignedToUserId_tblUser_UserId] FOREIGN KEY (AssignedToUserId) REFERENCES [dbo].[tblUser] (UserId),
	[IsCompleted]		BIT					NOT NULL	CONSTRAINT [DF_tblUser_IsCompleted] DEFAULT ((0)),
	[CompletedDate]		DATETIME2 (0)		NULL,
	[IsCancelled]		BIT					NOT NULL	CONSTRAINT [DF_tblUser_IsCancelled] DEFAULT ((0)),
	[CancelledDate]		DATETIME2 (0)		NULL,
	[CreatedDate]		DATETIME2			NOT NULL	CONSTRAINT [DF_tblTask_CreatedDate] DEFAULT (GETUTCDATE()),
	[CreatedByUserId]	INT					NOT NULL	CONSTRAINT [FK_tblTask_CreatedByUserId_tblUser_UserId] FOREIGN KEY (CreatedByUserId) REFERENCES [dbo].[tblUser] (UserId),
	[LastModifiedDate]	DATETIME2			NOT NULL	CONSTRAINT [DF_tblTask_LastModifiedDate] DEFAULT (GETUTCDATE()),
	[EntityId]			UNIQUEIDENTIFIER	NOT NULL	DEFAULT (newid())
)
